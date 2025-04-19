import ChatLayout from "@/components/layouts/ChatLayout";

export default function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatLayout>
      {children}
    </ChatLayout>
  );
}
