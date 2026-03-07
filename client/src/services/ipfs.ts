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
    try {
      ipfsClient = await create();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw new Error(`Failed to connect to IPFS: ${message}. Check your network and Infura credentials.`);
    }
  }
  return ipfsClient;
}

export async function uploadToIPFS(file: File | Blob): Promise<string> {
  try {
    const client = await getClient();
    const added = await client.add(file);
    return added.path;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    throw new Error(`IPFS upload failed: ${message}`);
  }
}
