FROM public.ecr.aws/lambda/nodejs:24 AS builder

WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY src ./src

FROM public.ecr.aws/lambda/nodejs:24

COPY --from=builder /build/node_modules ${LAMBDA_TASK_ROOT}/node_modules
COPY --from=builder /build/src ${LAMBDA_TASK_ROOT}/src

CMD [ "src/helloWorld.handler" ]
