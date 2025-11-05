import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings, { IListingsParams } from "@/app/actions/getListings";

interface CreateListingBody {
  title: string;
  description: string;
  imageSrc: string;
  category: string;
  roomCount: string | number;
  bathroomCount: string | number;
  guestCount: string | number;
  location?: { value: string };
  price: string | number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params: IListingsParams = {};

    const userId = searchParams.get("userId");
    const category = searchParams.get("category");
    const roomCount = searchParams.get("roomCount");
    const guestCount = searchParams.get("guestCount");
    const bathroomCount = searchParams.get("bathroomCount");
    const locationValue = searchParams.get("locationValue");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (userId) params.userId = userId;
    if (category) params.category = category;
    if (roomCount) params.roomCount = parseInt(roomCount, 10);
    if (guestCount) params.guestCount = parseInt(guestCount, 10);
    if (bathroomCount) params.bathroomCount = parseInt(bathroomCount, 10);
    if (locationValue) params.locationValue = locationValue;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const listings = await getListings(params);

    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching listings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }
  const body = (await request.json()) as CreateListingBody;
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
  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount:
        typeof roomCount === "number"
          ? roomCount
          : parseInt(String(roomCount), 10),
      bathroomCount:
        typeof bathroomCount === "number"
          ? bathroomCount
          : parseInt(String(bathroomCount), 10),
      guestCount:
        typeof guestCount === "number"
          ? guestCount
          : parseInt(String(guestCount), 10),
      locationValue: location?.value || "",
      price: typeof price === "number" ? price : parseInt(String(price), 10),
      userId: currentUser.id,
    },
  });
  return NextResponse.json(listing);
}
