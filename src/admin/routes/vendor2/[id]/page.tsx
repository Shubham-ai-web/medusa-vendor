// src/admin/routes/articles/[id]/page.tsx
import { Button, Container, Heading } from "@medusajs/ui";
import { Link, LoaderFunctionArgs, Outlet, UIMatch, useLoaderData } from "react-router-dom";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  return {
    id,
  };
}

export const handle = {
  breadcrumb: (match: UIMatch<{ id: string }>) => {
    const { id } = match.params;
    return `#${id}`;
  },
};

const ProfilePage = () => {
  const { id } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <div>
      <Container className="flex justify-between items-center">
        <Heading>Article {id}</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="edit">Edit</Link>
        </Button>
      </Container>
      {/* This will be used for the next example of an Outlet route */}
      <Outlet />
    </div>
  );
};

export default ProfilePage;