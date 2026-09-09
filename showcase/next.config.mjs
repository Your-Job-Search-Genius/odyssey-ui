import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    // The showcase app lives in showcase/ but imports the real component
    // library source (components/, utils/, hooks/) from the parent repo
    // root, so Next must be told to compile files outside its own project
    // directory.
    experimental: {
        externalDir: true,
    },
};

export default withMDX(config);
