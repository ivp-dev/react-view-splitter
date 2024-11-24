/** @type {import('@ladle/react').UserConfig} */
export default {
  base: "/react-view-splitter/",
  stories: ["./src/**/*.stories.mdx", "./src/**/*.stories.@(js|jsx|ts|tsx)"],
  port: 3000,
  addons: {
    width: {
      enabled: false,
    },
  },
};
