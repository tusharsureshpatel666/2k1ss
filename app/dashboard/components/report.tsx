"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Megaphone } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const REPORT_REASONS = [
  "Spam or misleading",
  "Inappropriate content",
  "Fraud or scam",
  "Duplicate listing",
  "Other",
];

export default function ReportDialog() {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!reason) return alert("Please select a reason");

    console.log({
      reason,
      message,
    });

    // 🔥 API call here
    // await fetch("/api/report", { method: "POST", body: ... })
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Megaphone className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Report this listing</DialogTitle>
        </DialogHeader>

        {/* Reasons */}
        <RadioGroup
          value={reason}
          onValueChange={setReason}
          className="space-y-3"
        >
          {REPORT_REASONS.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <RadioGroupItem value={item} id={item} />
              <Label htmlFor={item}>{item}</Label>
            </div>
          ))}
        </RadioGroup>

        {/* Optional message */}
        <Textarea
          placeholder="Tell us more (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-3"
        />

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} disabled={!reason}>
            Submit Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
