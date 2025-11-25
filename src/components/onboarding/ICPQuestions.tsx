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
            <Label className="text-subheadline text-label">what's your role?</Label>
            <Select value={role} onValueChange={onRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketer">marketer</SelectItem>
                <SelectItem value="developer">developer</SelectItem>
                <SelectItem value="creator">creator/influencer</SelectItem>
                <SelectItem value="sales">sales</SelectItem>
                <SelectItem value="other">other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-subheadline text-label">primary use case</Label>
            <Select value={primaryUseCase} onValueChange={onUseCaseChange}>
              <SelectTrigger>
                <SelectValue placeholder="select use case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">marketing campaigns</SelectItem>
                <SelectItem value="social">social media</SelectItem>
                <SelectItem value="portfolio">portfolio/website</SelectItem>
                <SelectItem value="development">development/testing</SelectItem>
                <SelectItem value="other">other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-subheadline text-label">team size</Label>
            <Select value={teamSize} onValueChange={onTeamSizeChange}>
              <SelectTrigger>
                <SelectValue placeholder="select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">just me</SelectItem>
                <SelectItem value="2-10">2-10 people</SelectItem>
                <SelectItem value="11-50">11-50 people</SelectItem>
                <SelectItem value="50+">50+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-subheadline text-label">primary use case</Label>
            <Select value={primaryUseCase} onValueChange={onUseCaseChange}>
              <SelectTrigger>
                <SelectValue placeholder="select primary use case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">marketing campaigns</SelectItem>
                <SelectItem value="sales">sales outreach</SelectItem>
                <SelectItem value="events">events & conferences</SelectItem>
                <SelectItem value="hr">hr & recruiting</SelectItem>
                <SelectItem value="development">product development</SelectItem>
                <SelectItem value="other">other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-subheadline text-label">your role in the team</Label>
            <Select value={role} onValueChange={onRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketer">marketer</SelectItem>
                <SelectItem value="sales">sales</SelectItem>
                <SelectItem value="marketing_ops">marketing ops</SelectItem>
                <SelectItem value="developer">developer</SelectItem>
                <SelectItem value="manager">manager/leader</SelectItem>
                <SelectItem value="other">other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}
