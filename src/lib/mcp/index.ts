import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listDiseasesTool from "./tools/list-diseases";
import searchBySymptomsTool from "./tools/search-by-symptoms";
import getMyProfileTool from "./tools/get-my-profile";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "cropguard-mcp",
  title: "CropGuard",
  version: "0.1.0",
  instructions:
    "CropGuard exposes an editorial almanac of crop diseases plus symptom-based diagnosis. Use `list_diseases` to browse the catalog, `search_diseases_by_symptoms` to match observed symptoms to likely diseases, and `get_my_profile` to read the signed-in farmer's account.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listDiseasesTool, searchBySymptomsTool, getMyProfileTool],
});
