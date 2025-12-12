
-- Fix RLS policies with JOIN anti-patterns across 14+ tables
-- Replace EXISTS/IN subqueries with has_workspace_access() function

-- 1. ab_test_variants (fix via ab_tests join)
DROP POLICY IF EXISTS "Users can view their workspace ab test variants" ON public.ab_test_variants;
CREATE POLICY "Users can view their workspace ab test variants" ON public.ab_test_variants
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.ab_tests t 
    WHERE t.id = ab_test_variants.test_id 
    AND public.has_workspace_access(auth.uid(), t.workspace_id)
  )
);

-- 2. ai_recommendations
DROP POLICY IF EXISTS "Users can view their workspace recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can view their workspace recommendations" ON public.ai_recommendations
FOR SELECT USING (public.has_workspace_access(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Users can dismiss their workspace recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can dismiss their workspace recommendations" ON public.ai_recommendations
FOR UPDATE USING (public.has_workspace_access(auth.uid(), workspace_id));

-- 3. analytics_anomalies
DROP POLICY IF EXISTS "Users can view their workspace anomalies" ON public.analytics_anomalies;
CREATE POLICY "Users can view their workspace anomalies" ON public.analytics_anomalies
FOR SELECT USING (public.has_workspace_access(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Users can dismiss their workspace anomalies" ON public.analytics_anomalies;
CREATE POLICY "Users can dismiss their workspace anomalies" ON public.analytics_anomalies
FOR UPDATE USING (public.has_workspace_access(auth.uid(), workspace_id));

-- 4. analytics_share_links
DROP POLICY IF EXISTS "Users can manage their workspace share links" ON public.analytics_share_links;
CREATE POLICY "Users can manage their workspace share links" ON public.analytics_share_links
FOR ALL USING (public.has_workspace_access(auth.uid(), workspace_id));

-- 5. api_key_access_logs (fix via api_keys join)
DROP POLICY IF EXISTS "Users can view their api key access logs" ON public.api_key_access_logs;
CREATE POLICY "Users can view their api key access logs" ON public.api_key_access_logs
FOR SELECT USING (public.has_api_key_access(auth.uid(), api_key_id));

-- 6. attribution_journeys
DROP POLICY IF EXISTS "Users can view their workspace journeys" ON public.attribution_journeys;
CREATE POLICY "Users can view their workspace journeys" ON public.attribution_journeys
FOR SELECT USING (public.has_workspace_access(auth.uid(), workspace_id));

-- 7. audit_events
DROP POLICY IF EXISTS "Users can view their workspace audit events" ON public.audit_events;
CREATE POLICY "Users can view their workspace audit events" ON public.audit_events
FOR SELECT USING (public.has_workspace_access(auth.uid(), workspace_id));

-- 8. audit_velocity_tracking
DROP POLICY IF EXISTS "Users can view their workspace velocity tracking" ON public.audit_velocity_tracking;
CREATE POLICY "Users can view their workspace velocity tracking" ON public.audit_velocity_tracking
FOR SELECT USING (public.has_workspace_access(auth.uid(), workspace_id));

-- 9. backup_logs
DROP POLICY IF EXISTS "Users can view their workspace backup logs" ON public.backup_logs;
CREATE POLICY "Users can view their workspace backup logs" ON public.backup_logs
FOR SELECT USING (public.has_workspace_access(auth.uid(), workspace_id));

-- 10. backup_schedules
DROP POLICY IF EXISTS "Users can manage their workspace backup schedules" ON public.backup_schedules;
CREATE POLICY "Users can manage their workspace backup schedules" ON public.backup_schedules
FOR ALL USING (public.has_workspace_access(auth.uid(), workspace_id));

-- 11. bulk_upload_comments
DROP POLICY IF EXISTS "Users can view comments on their workspace uploads" ON public.bulk_upload_comments;
CREATE POLICY "Users can view comments on their workspace uploads" ON public.bulk_upload_comments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bulk_uploads bu 
    WHERE bu.id = bulk_upload_comments.bulk_upload_uuid 
    AND public.has_workspace_access(auth.uid(), bu.workspace_id)
  )
);

-- 12. workspace_invitations - fix the subquery pattern
DROP POLICY IF EXISTS "Workspace admins can manage invitations" ON public.workspace_invitations;
CREATE POLICY "Workspace admins can manage invitations" ON public.workspace_invitations
FOR ALL USING (public.has_workspace_access(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Users can view invitations sent to them" ON public.workspace_invitations;
CREATE POLICY "Users can view invitations sent to them" ON public.workspace_invitations
FOR SELECT USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR public.has_workspace_access(auth.uid(), workspace_id)
);

-- 13. custom_reports
DROP POLICY IF EXISTS "Users can manage their workspace reports" ON public.custom_reports;
CREATE POLICY "Users can manage their workspace reports" ON public.custom_reports
FOR ALL USING (public.has_workspace_access(auth.uid(), workspace_id));

-- 14. conversion_events
DROP POLICY IF EXISTS "Users can view their workspace conversions" ON public.conversion_events;
CREATE POLICY "Users can view their workspace conversions" ON public.conversion_events
FOR SELECT USING (public.has_workspace_access(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Users can insert their workspace conversions" ON public.conversion_events;
CREATE POLICY "Users can insert their workspace conversions" ON public.conversion_events
FOR INSERT WITH CHECK (public.has_workspace_access(auth.uid(), workspace_id));
