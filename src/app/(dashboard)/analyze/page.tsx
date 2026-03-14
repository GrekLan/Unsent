import { ConversationInput } from "@/components/analyze/ConversationInput";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Analyze Conversation - unSent",
  description: "Get AI-powered coaching on your dating conversations",
};

export default function AnalyzePage() {
  return (
    <Container className="py-10 sm:py-12">
      <PageHeader
        eyebrow="Analyze"
        title="Analyze Conversation"
        description="Paste your chat or upload a screenshot to get coaching."
        className="mb-8"
      />
      
      <ConversationInput />
    </Container>
  );
}
