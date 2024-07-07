import React from "react";
import LoginHeader from "@/components/base/LoginHeader";
import Particle from "@/components/base/particles";

export default function Home() {
  return (
    <div className="bg-white">
      <Particle />
      <LoginHeader />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              AI/ML Intelligent Platform
            </h1>
            <h5 className="text-end">NTUST MITLab</h5>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              The AI/ML Intelligent Platform is a software solution that enables
              organizations to efficiently develop, deploy, and manage machine
              learning and artificial intelligence models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

