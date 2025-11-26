-- Insert seed data for waitlist with varied scores
-- This creates 100 sample users with realistic referral scores for leaderboard display
-- Using 'pending' status which is the default allowed value

INSERT INTO public.early_access_requests (
  name, email, team_size, role, reason_for_joining, how_heard, referral_score
) VALUES
  -- Top tier referrers (scores 80-100)
  ('Sarah Johnson', 'sarah.j.1@example.com', '51-200', 'marketing', 'link management', 'referral', 95),
  ('Michael Chen', 'michael.c.2@example.com', '11-50', 'sales', 'utm tracking', 'google search', 88),
  ('Emily Rodriguez', 'emily.r.3@example.com', '201-500', 'marketing ops', 'analytics', 'social media', 82),
  ('David Kim', 'david.k.4@example.com', '51-200', 'developer', 'all of the above', 'referral', 80),
  
  -- High performers (scores 60-79)
  ('Jessica Martinez', 'jessica.m.5@example.com', '11-50', 'marketing', 'qr codes', 'product hunt', 75),
  ('James Wilson', 'james.w.6@example.com', '2-10', 'sales', 'link management', 'blog', 72),
  ('Amanda Taylor', 'amanda.t.7@example.com', '51-200', 'marketing ops', 'team governance', 'referral', 68),
  ('Christopher Lee', 'chris.l.8@example.com', '11-50', 'developer', 'utm tracking', 'google search', 65),
  ('Lauren Brown', 'lauren.b.9@example.com', '2-10', 'agency', 'all of the above', 'social media', 62),
  ('Daniel Garcia', 'daniel.g.10@example.com', '51-200', 'marketing', 'analytics', 'referral', 60),
  
  -- Mid-tier (scores 40-59)
  ('Sophia Anderson', 'sophia.a.11@example.com', '11-50', 'sales', 'link management', 'podcast', 55),
  ('Matthew Thomas', 'matthew.t.12@example.com', '2-10', 'marketing', 'qr codes', 'google search', 52),
  ('Olivia Jackson', 'olivia.j.13@example.com', '51-200', 'marketing ops', 'utm tracking', 'referral', 48),
  ('Ethan White', 'ethan.w.14@example.com', '11-50', 'developer', 'analytics', 'social media', 45),
  ('Isabella Harris', 'isabella.h.15@example.com', '2-10', 'agency', 'team governance', 'product hunt', 42),
  ('Andrew Martin', 'andrew.m.16@example.com', '51-200', 'marketing', 'all of the above', 'blog', 40),
  
  -- Lower tier (scores 20-39)
  ('Mia Thompson', 'mia.t.17@example.com', '11-50', 'sales', 'link management', 'referral', 35),
  ('Alexander Moore', 'alex.m.18@example.com', '2-10', 'marketing', 'qr codes', 'google search', 32),
  ('Charlotte Davis', 'charlotte.d.19@example.com', '51-200', 'marketing ops', 'utm tracking', 'social media', 28),
  ('William Miller', 'william.m.20@example.com', '11-50', 'developer', 'analytics', 'podcast', 25),
  
  -- Entry level (scores 10-19)
  ('Ava Wilson', 'ava.w.21@example.com', '2-10', 'marketing', 'link management', 'google search', 18),
  ('Benjamin Lopez', 'ben.l.22@example.com', '11-50', 'sales', 'team governance', 'social media', 15),
  ('Emma Martinez', 'emma.m.23@example.com', '51-200', 'agency', 'all of the above', 'referral', 12),
  ('Lucas Garcia', 'lucas.g.24@example.com', '2-10', 'marketing', 'utm tracking', 'product hunt', 10),
  
  -- Additional bulk users (scores 5-50, varying distribution)
  ('Noah Rodriguez', 'noah.r.25@example.com', '11-50', 'sales', 'qr codes', 'blog', 48),
  ('Aria Hernandez', 'aria.h.26@example.com', '2-10', 'marketing', 'analytics', 'google search', 45),
  ('Liam Gonzalez', 'liam.g.27@example.com', '51-200', 'developer', 'link management', 'referral', 42),
  ('Harper Perez', 'harper.p.28@example.com', '11-50', 'marketing ops', 'utm tracking', 'social media', 38),
  ('Mason Sanchez', 'mason.s.29@example.com', '2-10', 'agency', 'team governance', 'podcast', 35),
  ('Evelyn Rivera', 'evelyn.r.30@example.com', '51-200', 'marketing', 'all of the above', 'product hunt', 32),
  
  -- Continue with more varied users
  ('Logan Torres', 'logan.t.31@example.com', '11-50', 'sales', 'qr codes', 'google search', 58),
  ('Abigail Flores', 'abigail.f.32@example.com', '2-10', 'marketing', 'link management', 'referral', 54),
  ('Elijah Nguyen', 'elijah.n.33@example.com', '51-200', 'developer', 'analytics', 'social media', 50),
  ('Avery Hill', 'avery.h.34@example.com', '11-50', 'marketing ops', 'utm tracking', 'blog', 46),
  ('Jackson Green', 'jackson.g.35@example.com', '2-10', 'agency', 'team governance', 'podcast', 43),
  ('Ella Adams', 'ella.a.36@example.com', '51-200', 'marketing', 'all of the above', 'google search', 40),
  ('Aiden Baker', 'aiden.b.37@example.com', '11-50', 'sales', 'qr codes', 'referral', 37),
  ('Scarlett Nelson', 'scarlett.n.38@example.com', '2-10', 'marketing', 'link management', 'social media', 34),
  ('Carter Carter', 'carter.c.39@example.com', '51-200', 'developer', 'analytics', 'product hunt', 30),
  ('Grace Mitchell', 'grace.m.40@example.com', '11-50', 'marketing ops', 'utm tracking', 'blog', 27),
  
  -- More entries to reach 100 total
  ('Sebastian Roberts', 'sebastian.r.41@example.com', '2-10', 'marketing', 'qr codes', 'google search', 56),
  ('Victoria Turner', 'victoria.t.42@example.com', '51-200', 'sales', 'team governance', 'referral', 53),
  ('Jack Phillips', 'jack.p.43@example.com', '11-50', 'agency', 'all of the above', 'social media', 49),
  ('Chloe Campbell', 'chloe.c.44@example.com', '2-10', 'marketing', 'link management', 'podcast', 44),
  ('Owen Parker', 'owen.p.45@example.com', '51-200', 'developer', 'analytics', 'product hunt', 41),
  ('Lily Evans', 'lily.e.46@example.com', '11-50', 'marketing ops', 'utm tracking', 'google search', 39),
  ('Luke Edwards', 'luke.e.47@example.com', '2-10', 'sales', 'qr codes', 'referral', 36),
  ('Zoe Collins', 'zoe.c.48@example.com', '51-200', 'marketing', 'team governance', 'social media', 33),
  ('Henry Stewart', 'henry.s.49@example.com', '11-50', 'agency', 'all of the above', 'blog', 29),
  ('Nora Morris', 'nora.m.50@example.com', '2-10', 'marketing', 'link management', 'podcast', 26),
  
  ('Samuel Rogers', 'samuel.r.51@example.com', '51-200', 'developer', 'analytics', 'google search', 57),
  ('Hannah Reed', 'hannah.r.52@example.com', '11-50', 'marketing ops', 'utm tracking', 'referral', 51),
  ('Wyatt Cook', 'wyatt.c.53@example.com', '2-10', 'sales', 'qr codes', 'social media', 47),
  ('Addison Morgan', 'addison.m.54@example.com', '51-200', 'marketing', 'team governance', 'product hunt', 44),
  ('Grayson Bell', 'grayson.b.55@example.com', '11-50', 'agency', 'all of the above', 'blog', 40),
  ('Lillian Murphy', 'lillian.m.56@example.com', '2-10', 'marketing', 'link management', 'google search', 38),
  ('Julian Bailey', 'julian.b.57@example.com', '51-200', 'developer', 'analytics', 'referral', 35),
  ('Layla Rivera', 'layla.r.58@example.com', '11-50', 'marketing ops', 'utm tracking', 'social media', 31),
  ('Isaac Cooper', 'isaac.c.59@example.com', '2-10', 'sales', 'qr codes', 'podcast', 28),
  ('Penelope Richardson', 'penelope.r.60@example.com', '51-200', 'marketing', 'team governance', 'product hunt', 24),
  
  ('Gabriel Cox', 'gabriel.c.61@example.com', '11-50', 'agency', 'all of the above', 'google search', 22),
  ('Aubrey Howard', 'aubrey.h.62@example.com', '2-10', 'marketing', 'link management', 'referral', 20),
  ('Anthony Ward', 'anthony.w.63@example.com', '51-200', 'developer', 'analytics', 'social media', 16),
  ('Stella Torres', 'stella.t.64@example.com', '11-50', 'marketing ops', 'utm tracking', 'blog', 14),
  ('Dylan Peterson', 'dylan.p.65@example.com', '2-10', 'sales', 'qr codes', 'podcast', 11),
  ('Bella Gray', 'bella.g.66@example.com', '51-200', 'marketing', 'team governance', 'google search', 8),
  ('Lincoln Ramirez', 'lincoln.r.67@example.com', '11-50', 'agency', 'all of the above', 'referral', 52),
  ('Natalie James', 'natalie.j.68@example.com', '2-10', 'marketing', 'link management', 'social media', 48),
  ('Jaxon Watson', 'jaxon.w.69@example.com', '51-200', 'developer', 'analytics', 'product hunt', 45),
  ('Claire Brooks', 'claire.b.70@example.com', '11-50', 'marketing ops', 'utm tracking', 'blog', 41),
  
  ('Josiah Kelly', 'josiah.k.71@example.com', '2-10', 'sales', 'qr codes', 'google search', 37),
  ('Elena Sanders', 'elena.s.72@example.com', '51-200', 'marketing', 'team governance', 'referral', 34),
  ('Mateo Price', 'mateo.p.73@example.com', '11-50', 'agency', 'all of the above', 'social media', 31),
  ('Maya Bennett', 'maya.b.74@example.com', '2-10', 'marketing', 'link management', 'podcast', 27),
  ('Ezra Wood', 'ezra.w.75@example.com', '51-200', 'developer', 'analytics', 'product hunt', 23),
  ('Ruby Barnes', 'ruby.b.76@example.com', '11-50', 'marketing ops', 'utm tracking', 'google search', 19),
  ('Colton Ross', 'colton.r.77@example.com', '2-10', 'sales', 'qr codes', 'referral', 17),
  ('Kennedy Henderson', 'kennedy.h.78@example.com', '51-200', 'marketing', 'team governance', 'social media', 13),
  ('Cameron Coleman', 'cameron.c.79@example.com', '11-50', 'agency', 'all of the above', 'blog', 9),
  ('Savannah Jenkins', 'savannah.j.80@example.com', '2-10', 'marketing', 'link management', 'podcast', 6),
  
  ('Carson Perry', 'carson.p.81@example.com', '51-200', 'developer', 'analytics', 'google search', 54),
  ('Brooklyn Powell', 'brooklyn.p.82@example.com', '11-50', 'marketing ops', 'utm tracking', 'referral', 49),
  ('Kayden Long', 'kayden.l.83@example.com', '2-10', 'sales', 'qr codes', 'social media', 46),
  ('Piper Patterson', 'piper.p.84@example.com', '51-200', 'marketing', 'team governance', 'product hunt', 42),
  ('Brayden Hughes', 'brayden.h.85@example.com', '11-50', 'agency', 'all of the above', 'blog', 39),
  ('Skylar Flores', 'skylar.f.86@example.com', '2-10', 'marketing', 'link management', 'google search', 36),
  ('Miles Washington', 'miles.w.87@example.com', '51-200', 'developer', 'analytics', 'referral', 33),
  ('Alice Butler', 'alice.b.88@example.com', '11-50', 'marketing ops', 'utm tracking', 'social media', 29),
  ('Easton Simmons', 'easton.s.89@example.com', '2-10', 'sales', 'qr codes', 'podcast', 26),
  ('Violet Foster', 'violet.f.90@example.com', '51-200', 'marketing', 'team governance', 'product hunt', 21),
  
  ('Brody Gonzales', 'brody.g.91@example.com', '11-50', 'agency', 'all of the above', 'google search', 18),
  ('Madelyn Bryant', 'madelyn.b.92@example.com', '2-10', 'marketing', 'link management', 'referral', 15),
  ('Tristan Alexander', 'tristan.a.93@example.com', '51-200', 'developer', 'analytics', 'social media', 12),
  ('Kinsley Russell', 'kinsley.r.94@example.com', '11-50', 'marketing ops', 'utm tracking', 'blog', 10),
  ('Parker Griffin', 'parker.g.95@example.com', '2-10', 'sales', 'qr codes', 'podcast', 7),
  ('Alexa Diaz', 'alexa.d.96@example.com', '51-200', 'marketing', 'team governance', 'google search', 5),
  ('Bryson Hayes', 'bryson.h.97@example.com', '11-50', 'agency', 'all of the above', 'referral', 50),
  ('Genesis Myers', 'genesis.m.98@example.com', '2-10', 'marketing', 'link management', 'social media', 43),
  ('Adrian Ford', 'adrian.f.99@example.com', '51-200', 'developer', 'analytics', 'product hunt', 38),
  ('Naomi Hamilton', 'naomi.h.100@example.com', '11-50', 'marketing ops', 'utm tracking', 'blog', 30);