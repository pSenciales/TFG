import React from "react";
import Link from "next/link";

export default function RegisterFooter() {
  return (
    <span className="text-silver">
      Don&apos;t have an account,&nbsp;
      <Link href="/signup" className="text-blue underline">
        Sign up here!
      </Link>
    </span>
  );
}