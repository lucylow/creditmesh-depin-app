const projectId = import.meta.env.VITE_INFURA_IPFS_PROJECT_ID as string | undefined;
const projectSecret = import.meta.env.VITE_INFURA_IPFS_PROJECT_SECRET as string | undefined;

function getAuthHeader(): Record<string, string> {
  if (!projectId || !projectSecret) return {};
  const auth = btoa(`${projectId}:${projectSecret}`);
  return { authorization: `Basic ${auth}` };
}

let ipfsClient: Awaited<ReturnType<typeof create>> | null = null;

async function create() {
  const { create } = await import("ipfs-http-client");
  return create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: getAuthHeader(),
  });
}

async function getClient() {
  if (!ipfsClient) {
    ipfsClient = await create();
  }
  return ipfsClient;
}

export async function uploadToIPFS(file: File | Blob): Promise<string> {
  const client = await getClient();
  const added = await client.add(file);
  return added.path;
}
