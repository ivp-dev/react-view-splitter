import { pascalCase } from "@/utils";

test("pascalCase util", () => {
  const kebabCase = "to-pascal-case";

  expect(pascalCase(kebabCase)).toBe("ToPascalCase");
});
