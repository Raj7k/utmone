import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ICPQuestionsProps {
  userType: "individual" | "organization";
  role: string;
  teamSize: string;
  primaryUseCase: string;
  onRoleChange: (value: string) => void;
  onTeamSizeChange: (value: string) => void;
  onUseCaseChange: (value: string) => void;
}

export function ICPQuestions({
  userType,
  role,
  teamSize,
  primaryUseCase,
  onRoleChange,
  onTeamSizeChange,
  onUseCaseChange,
}: ICPQuestionsProps) {
  return (
    <div className="space-y-6">
      {userType === "individual" ? (
        <>
          <div className="space-y-2">
            <Label className="text-subheadline text-label">What's your role?</Label>
            <Select value={role} onValueChange={onRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketer">Marketer</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="creator">Creator/Influencer</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-subheadline text-label">Primary use case</Label>
            <Select value={primaryUseCase} onValueChange={onUseCaseChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">Marketing campaigns</SelectItem>
                <SelectItem value="social">Social media</SelectItem>
                <SelectItem value="portfolio">Portfolio/Website</SelectItem>
                <SelectItem value="development">Development/Testing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-subheadline text-label">Team size</Label>
            <Select value={teamSize} onValueChange={onTeamSizeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Just me</SelectItem>
                <SelectItem value="2-10">2-10 people</SelectItem>
                <SelectItem value="11-50">11-50 people</SelectItem>
                <SelectItem value="50+">50+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-subheadline text-label">Primary use case</Label>
            <Select value={primaryUseCase} onValueChange={onUseCaseChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select primary use case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">Marketing campaigns</SelectItem>
                <SelectItem value="sales">Sales outreach</SelectItem>
                <SelectItem value="events">Events & conferences</SelectItem>
                <SelectItem value="hr">HR & recruiting</SelectItem>
                <SelectItem value="development">Product development</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-subheadline text-label">Your role in the team</Label>
            <Select value={role} onValueChange={onRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketer">Marketer</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing_ops">Marketing Ops</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="manager">Manager/Leader</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}
