import { rtdb } from "../database/firebase";
import { ref, get, child } from "firebase/database";

export async function getAllJobs() {
  try {
    const dbRef = ref(rtdb);

    const snapshot = await get(child(dbRef, "jobs"));

    if (!snapshot.exists()) {
      console.log("❌ No jobs found in Realtime DB");
      return [];
    }

    const jobsObj = snapshot.val();

    const jobList = Object.keys(jobsObj).map((id) => ({
      id,
      ...jobsObj[id],
    }));

    const finalJobs = [];

    for (let job of jobList) {
      let mitraData = null;

      if (job.mitra_id) {
        const mitraSnap = await get(child(dbRef, `mitra/${job.mitra_id}`));
        mitraData = mitraSnap.exists() ? mitraSnap.val() : null;
      }

      finalJobs.push({
        ...job,
        mitra: mitraData,
      });
    }

    return finalJobs;

  } catch (err) {
    console.error("🔥 REALTIME DB ERROR:", err);
    return [];
  }
}
