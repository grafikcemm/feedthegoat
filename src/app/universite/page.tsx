import { getUniversityData } from "@/app/actions/university";
import { UniversityClient } from "@/components/university/UniversityClient";
import { DailyShell } from "@/components/daily/DailyShell";

export default async function UniversitePage() {
  const [beykent, aof] = await Promise.all([
    getUniversityData('beykent'),
    getUniversityData('aof')
  ]);

  return (
    <DailyShell>
      <UniversityClient
        beykentData={beykent}
        aofData={aof}
      />
    </DailyShell>
  );
}
