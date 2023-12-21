import { db } from "@/server/db";
import * as z from "zod";
import { fromZodError } from "zod-validation-error";

type Config<Context> = {
  createContext(): Context;
};

type InferSchema<T> = T extends z.ZodTypeAny ? z.infer<T> : T;

interface TErroredResponse {
  success: false;
  message: string;
}

interface TSuccessResponse<T> {
  success: true;
  data: T;
}

function hasProp<Prop extends PropertyKey>(
  value: unknown,
  prop: Prop
): value is Record<Prop, unknown> {
  return typeof value === "object" && value !== null && prop in value;
}

export const typeSafeAction = <Context>(config: Config<Context>) => {
  const context = config.createContext();
  return <V extends z.ZodTypeAny | undefined, Result>(
    schema: V,
    actionFn: (data: {
      ctx: Context;
      input: InferSchema<V>;
    }) => Promise<Result> | Result
  ) => {
    return async (input: InferSchema<V>) => {
      try {
        let parsedData;
        if (schema) {
          parsedData = schema.parse(input);
        }

        const results = await actionFn({
          ctx: context,
          input: parsedData as InferSchema<V>,
        });

        const data: TSuccessResponse<typeof results> = {
          data: results,
          success: true,
        };
        return data;
      } catch (error) {
        const isZodError = error instanceof z.ZodError;

        const message = isZodError
          ? fromZodError(error).message
          : hasProp(error, "message")
          ? (error.message as string)
          : "An unknown error occurred";

        const data: TErroredResponse = {
          message,
          success: false,
        };
        return data;
      }
    };
  };
};

export const action = typeSafeAction({
  createContext() {
    return { db: db };
  },
});
