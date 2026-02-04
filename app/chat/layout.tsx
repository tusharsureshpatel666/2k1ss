import Sidebar from "./sidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="h-screen ">{children}</div>
    </Sidebar>
  );
}
