import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Step4Props = {
  setName: (name: string) => void;
  handleBirthdayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  birthday: string;
  isOldEnough: boolean;
  handleCreateAccount: () => void;
  loading: boolean;
};

export default function Step4({
  setName,
  handleBirthdayChange,
  name,
  birthday,
  isOldEnough,
  handleCreateAccount,
  loading
}: Step4Props) {
  return (
    <form className="grid gap-4">
      <h1 className="text-md mb-5">Complete your profile</h1>
      <Label>Name</Label>
      <Input
        required
        type="text"
        placeholder="Jhon Smith"
        onChange={(e) => setName(e.target.value)}
      />
      <Label>Date of birth</Label>
      <Input required type="date" onChange={handleBirthdayChange} />
      {!isOldEnough && birthday && (
        <div className="text-red-500 text-sm">
          You must be at least 16 years old.
        </div>
      )}
      <Button
        className="mt-10"
        disabled={!isOldEnough || birthday === "" || name === "" || loading}
        onClick={handleCreateAccount}
      >
        Create account
      </Button >
    </form>
  );
}
