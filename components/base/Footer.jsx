"use client";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";

const SITEMAP = [
  {
    title: "AI/ML Intelligent Platform",
    links: [
      "NTUST MITLAB Lab.",
      "|",
      "+886-2-27376386",
      "|",
      "mitlab.project.6g@gmail.com",
    ],
  },
];

// const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer className="w-full bottom-0 bg-slate-900 z-40">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mx-auto flex flex-row items-center justify-center w-full gap-8 py-8">
          {SITEMAP.map(({ links }, key) => (
            <div key={key} className="w-full">
              <ul className="flex items-center gap-x-8">
                {links.map((link, key) => (
                  <Typography
                    key={key}
                    as="li"
                    color="white"
                    className="font-normal"
                  >
                    {link}
                  </Typography>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col items-center justify-center border-t border-slate-50 py-4 md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-white md:mb-0"
          >
            {/* &copy; {currentYear}{" "} */}
            <a href="https://material-tailwind.com/">MITLAB Lab</a>. All Rights
            Reserved.
          </Typography>
          <div className="flex gap-4 text-white sm:justify-center">
            <div className="flex lg:flex-1 w-42">
              <a className="-m-1.5 p-1.5">
                <Image
                  src="/mitlab_logo_white.png"
                  alt="MITLab Logo"
                  width={40}
                  height={30}
                  priority
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
