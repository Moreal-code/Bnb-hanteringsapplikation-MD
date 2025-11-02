import prisma from "../libs/prismadb";

export default async function getListings() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: {
        createAt: "desc",
      },
    });
    return listings;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
