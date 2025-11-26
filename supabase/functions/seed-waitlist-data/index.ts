import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';
import { corsHeaders } from '../_shared/cors.ts';

const REFERRAL_CSV = await Deno.readTextFile(new URL('./referral_data.csv', import.meta.url).pathname);

interface CSVRow {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  createdTime: string;
}

function parseCSV(csv: string): CSVRow[] {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      firstName: values[0]?.trim() || '',
      lastName: values[1]?.trim() || '',
      email: values[2]?.trim() || '',
      phone: values[3]?.trim() || '',
      organization: values[4]?.trim() || '',
      createdTime: values[5]?.trim() || '',
    };
  }).filter(row => row.email); // Only include rows with valid emails
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function extractDomain(email: string): string {
  const match = email.match(/@(.+)$/);
  return match ? match[1].toLowerCase() : '';
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateScores(): { engagement: number; referral: number; fit: number; total: number } {
  const engagement = Math.floor(Math.random() * 40) + 5; // 5-45
  
  // Weighted referral score - most users have low scores
  const rand = Math.random();
  let referral = 0;
  if (rand < 0.7) referral = Math.floor(Math.random() * 20); // 70% get 0-20
  else if (rand < 0.9) referral = Math.floor(Math.random() * 40) + 20; // 20% get 20-60
  else referral = Math.floor(Math.random() * 20) + 60; // 10% get 60-80
  
  const fit = Math.floor(Math.random() * 30) + 10; // 10-40
  const total = engagement + referral + fit;
  
  return { engagement, referral, fit, total };
}

function determineStatus(index: number, total: number): { status: string; badge: string | null } {
  const percentile = index / total;
  
  if (percentile < 0.02) {
    // Top 2% approved with founding member badge
    return { status: 'approved', badge: 'founding_member' };
  } else if (percentile < 0.10) {
    // Next 8% waitlisted
    return { status: 'waitlisted', badge: null };
  } else {
    // Remaining 90% pending
    return { status: 'pending', badge: null };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Parsing CSV data...');
    const rows = parseCSV(REFERRAL_CSV);
    console.log(`Found ${rows.length} records to import`);

    const teamSizes = ['just me', '2-10', '11-50', '51-200', '201-500', '500+'];
    const reasons = [
      'link management',
      'UTM tracking',
      'QR codes',
      'analytics',
      'team governance',
      'all of the above'
    ];

    // Shuffle rows for random status distribution
    const shuffledRows = rows.sort(() => Math.random() - 0.5);

    const records = shuffledRows.map((row, index) => {
      const scores = generateScores();
      const { status, badge } = determineStatus(index, shuffledRows.length);
      const domain = row.organization !== 'NA' && row.organization !== '' 
        ? row.organization.toLowerCase().replace(/\s+/g, '') 
        : extractDomain(row.email);

      return {
        name: `${row.firstName} ${row.lastName}`.trim(),
        email: row.email,
        role: 'partner manager',
        team_size: randomChoice(teamSizes),
        reason_for_joining: randomChoice(reasons),
        how_heard: 'referral',
        company_domain: domain,
        referral_code: generateReferralCode(),
        engagement_score: scores.engagement,
        referral_score: scores.referral,
        fit_score: scores.fit,
        total_access_score: scores.total,
        status,
        badge,
        created_at: row.createdTime || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    console.log(`Inserting ${records.length} records...`);
    
    // Insert in batches of 100 to avoid timeouts
    const batchSize = 100;
    let insertedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('early_access_requests')
        .insert(batch)
        .select('id');

      if (error) {
        console.error(`Batch ${i / batchSize + 1} error:`, error);
        errorCount += batch.length;
      } else {
        insertedCount += data?.length || 0;
        console.log(`Batch ${i / batchSize + 1} completed: ${data?.length} records inserted`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Import completed`,
        stats: {
          total: records.length,
          inserted: insertedCount,
          errors: errorCount,
          pending: records.filter(r => r.status === 'pending').length,
          waitlisted: records.filter(r => r.status === 'waitlisted').length,
          approved: records.filter(r => r.status === 'approved').length,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error importing data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
