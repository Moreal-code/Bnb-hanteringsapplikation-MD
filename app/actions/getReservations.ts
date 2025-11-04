import prisma from "@/app/libs/prismadb";
import { SafeReservation } from "@/app/types";
import { Prisma } from "@/app/generated/prisma";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(params: IParams): Promise<SafeReservation[]> {
  try {
    const { listingId, userId, authorId } = params;

    const query: Prisma.ReservationWhereInput = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createAt: reservation.listing.createAt.toISOString(),
      },
    }));

    return safeReservations;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
