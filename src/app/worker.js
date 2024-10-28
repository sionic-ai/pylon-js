import { pipeline, env } from "@huggingface/transformers";

// Skip local model check
env.allowLocalModels = false;

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
    static task = 'embeddings';
    static model = 'sionic-ai/bge-m3-v1-quantized-ir8';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model,
                { progress_callback, device: 'webgpu', dtype: 'fp16'
            });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    // Retrieve the classification pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    let emb = await PipelineSingleton.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });

    // Actually perform the classification

    let output = await emb(event.data.text);


    console.log(output.data.slice(0,1024))

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output.data.slice(0,1024),
    });
});
