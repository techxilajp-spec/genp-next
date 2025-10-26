import { UserTaskDetails } from "@/components/user-task-details";
import { MobileHeader } from "@/components/mobile-header";

interface UserTaskPageProps {
  params: {
    userId: string;
  };
}

// Only if you made this async!
export default async function UserTaskPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <>
      <MobileHeader title='User Tasks' />
      <div className='p-4 lg:p-6'>
        <UserTaskDetails userId={userId} />
      </div>
    </>
  );
}
