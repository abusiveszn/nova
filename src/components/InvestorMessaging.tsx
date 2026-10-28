import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import type { InvestorInquiry, InvestmentProject } from "@/types";

interface InvestorMessagingProps {
  project: InvestmentProject;
}

export function InvestorMessaging({ project }: InvestorMessagingProps) {
  const { state, dispatch } = useApp();
  const [messageContent, setMessageContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get messages for this project
  const projectInquiries = state.investorInquiries.filter(
    (i) => i.projectId === project.id,
  );

  const handleSendMessage = () => {
    if (!messageContent.trim() || !state.currentUser) return;

    setIsLoading(true);

    // Create new inquiry
    const newInquiry: InvestorInquiry = {
      id: `inq_${Date.now()}`,
      senderId: state.currentUser.userId,
      senderName: state.currentUser.fullName,
      receiverId: project.projectManagerId,
      projectId: project.id,
      content: messageContent,
      createdAt: Date.now(),
      read: false,
    };

    dispatch({
      type: "ADD_INVESTOR_INQUIRY",
      payload: newInquiry,
    });

    setMessageContent("");
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Messages Display */}
      {projectInquiries.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-4 bg-muted/30">
          {projectInquiries.map((inquiry) => {
            const isCurrentUser =
              inquiry.senderId === state.currentUser?.userId;

            return (
              <div
                key={inquiry.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-xs p-3 ${
                    isCurrentUser
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-xs font-semibold mb-1">
                    {inquiry.senderName}
                  </p>
                  <p className="text-sm">{inquiry.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      isCurrentUser ? "text-blue-100" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(inquiry.createdAt).toLocaleTimeString()}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center bg-muted/30">
          <MessageCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </p>
        </Card>
      )}

      {/* Message Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about the project, timeline, terms..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageContent.trim() || isLoading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Press Enter to send or Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}
