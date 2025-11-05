import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";

interface IParams {
  listingId?: string;
}

interface UpdateListingBody {
  title?: string;
  description?: string;
  imageSrc?: string;
  category?: string;
  roomCount?: string | number;
  bathroomCount?: string | number;
  guestCount?: string | number;
  location?: { value: string };
  price?: string | number;
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

  const body = (await request.json()) as UpdateListingBody;
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
  if (roomCount !== undefined) updateData.roomCount = typeof roomCount === "number" ? roomCount : parseInt(String(roomCount), 10);
  if (bathroomCount !== undefined) updateData.bathroomCount = typeof bathroomCount === "number" ? bathroomCount : parseInt(String(bathroomCount), 10);
  if (guestCount !== undefined) updateData.guestCount = typeof guestCount === "number" ? guestCount : parseInt(String(guestCount), 10);
  if (location?.value !== undefined) updateData.locationValue = location.value;
  if (price !== undefined) updateData.price = typeof price === "number" ? price : parseInt(String(price), 10);

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

export async function GET(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const { listingId } = await params;

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const listing = await getListingById({ listingId });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching listing" },
      { status: 500 }
    );
  }
}
