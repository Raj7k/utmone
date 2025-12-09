import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { createLogger } from '../_shared/logger.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QAAccountRequest {
  email: string;
  password: string;
  fullName?: string;
  isAdmin?: boolean;
  planTier?: 'free' | 'starter' | 'growth' | 'business' | 'enterprise';
  workspaceName?: string;
}

Deno.serve(async (req) => {
  const logger = createLogger({ action: 'admin-create-qa-account' });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the requesting user is an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !adminUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', adminUser.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!adminRole) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: QAAccountRequest = await req.json();
    const { 
      email, 
      password, 
      fullName, 
      isAdmin = false, 
      planTier = 'free',
      workspaceName 
    } = body;

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logger.info('Creating QA account', { email, isAdmin, planTier });

    // Step 1: Create the user via admin API
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: fullName || `QA User - ${email}`,
        is_qa_account: true,
      },
    });

    if (createError) {
      logger.error('Failed to create user', createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = newUser.user.id;

    // Step 2: Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        full_name: fullName || `QA User - ${email}`,
      });

    if (profileError) {
      logger.warn('Profile creation failed (might already exist)', profileError);
    }

    // Step 3: Create workspace if planTier is specified
    const wsName = workspaceName || `QA Workspace - ${email.split('@')[0]}`;
    const wsSlug = `qa-${email.split('@')[0].replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}`;

    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .insert({
        name: wsName,
        slug: wsSlug,
        owner_id: userId,
        plan_tier: planTier,
        onboarding_completed: true,
      })
      .select()
      .single();

    if (wsError) {
      logger.error('Workspace creation failed', wsError);
    }

    // Step 4: Add admin role if requested
    if (isAdmin) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin',
        });

      if (roleError) {
        logger.warn('Admin role assignment failed', roleError);
      }
    }

    // Step 5: Add workspace member record
    if (workspace) {
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: userId,
          role: 'workspace_admin',
        });

      if (memberError) {
        logger.warn('Workspace member creation failed', memberError);
      }
    }

    // Step 6: Log the action
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_user_id: adminUser.id,
        action: 'create_qa_account',
        resource_type: 'profiles',
        resource_id: userId,
        new_values: {
          email,
          is_admin: isAdmin,
          plan_tier: planTier,
          workspace_name: wsName,
        },
      });

    logger.info('QA account created successfully', { userId, email, workspaceId: workspace?.id });

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userId,
          email,
          fullName: fullName || `QA User - ${email}`,
          isAdmin,
        },
        workspace: workspace ? {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          planTier: workspace.plan_tier,
        } : null,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logger.error('Error creating QA account', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
