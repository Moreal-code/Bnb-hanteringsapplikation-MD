import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";

interface IParams {
  listingid: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById({ listingId: params.listingid });
  const currentUser = await getCurrentUser();

  if (!listing) {
    return <EmptyState />;
  }

  return <ListingClient listing={listing} currentUser={currentUser} />;
};

export default ListingPage;
