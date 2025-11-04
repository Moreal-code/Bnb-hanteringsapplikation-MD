import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  listingId?: string;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = await params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  // Verify that the listing exists and belongs to the current user
  const existingListing = await prisma.listing.findFirst({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
  });

  if (!existingListing) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body;

  const updateData: {
    title?: string;
    description?: string;
    imageSrc?: string;
    category?: string;
    roomCount?: number;
    bathroomCount?: number;
    guestCount?: number;
    locationValue?: string;
    price?: number;
  } = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (imageSrc !== undefined) updateData.imageSrc = imageSrc;
  if (category !== undefined) updateData.category = category;
  if (roomCount !== undefined) updateData.roomCount = parseInt(roomCount, 10);
  if (bathroomCount !== undefined) updateData.bathroomCount = parseInt(bathroomCount, 10);
  if (guestCount !== undefined) updateData.guestCount = parseInt(guestCount, 10);
  if (location?.value !== undefined) updateData.locationValue = location.value;
  if (price !== undefined) updateData.price = parseInt(price, 10);

  const updatedListing = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: updateData,
  });

  return NextResponse.json(updatedListing);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = await params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}
