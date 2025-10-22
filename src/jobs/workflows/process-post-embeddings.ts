import type { WorkflowConfig } from 'payload'

export const ProcessPostEmbeddings: WorkflowConfig<'processPostEmbeddings'> = {
  slug: 'processPostEmbeddings',

  inputSchema: [{ name: 'postId', type: 'number', required: true }],

  // Workflow-level retries (optional)
  // If undefined, tasks use their own retry settings
  retries: undefined,

  handler: async ({ job, tasks }) => {
    const { postId } = job.input

    // Step 1: Generate embedding
    // The '1' is a unique ID for this task invocation
    // It must stay the same if the workflow is re-executed
    const embeddingResult = await tasks.generateEmbedding('1', {
      input: {
        collection: 'posts',
        docId: postId,
      },
    })

    // If embedding was skipped (already up to date), skip recommendations too
    if (embeddingResult.skipped) {
      return
    }

    // Step 2: Compute recommendations (only runs if embedding succeeded)
    await tasks.computeRecommendations('2', {
      input: {
        postId: postId,
      },
    })
  },
}
