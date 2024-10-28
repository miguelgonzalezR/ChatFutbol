const db = require("../conexion/database"); // Importa la conexión de la base de datos
const { Configuration, OpenAIApi } = require("openai");

// Configuración de OpenAI con los valores "quemados" en el código
const configuration = new Configuration({
  apiKey: '',
});
const openai = new OpenAIApi(configuration);

const gptModel = 'gpt-4'; // Define el modelo directamente aquí

// Función para obtener la respuesta de la API de OpenAI
async function callGPT(promptContent, systemContent, previousChat) {
  try {
    // Verifica si la pregunta ya existe en la base de datos
    const [rows] = await db.query("SELECT response FROM questions WHERE question = ?", [promptContent]);
    
    if (rows.length > 0) {
      // Si la pregunta existe, devuelve la respuesta almacenada en formato JSON
      return { success: true, response: rows[0].response };
    }

    // Si no existe, llama a GPT para obtener una nueva respuesta
    const messages = [
      { role: "system", content: systemContent },
      { role: "user", content: promptContent }
    ];

    if (previousChat) {
      messages.push({ role: "assistant", content: previousChat });
    }

    const response = await openai.createChatCompletion({
      model: gptModel,
      messages: messages,
    });

    const gptResponse = response.data.choices[0].message.content;

    // Guarda la pregunta y respuesta en la base de datos para futuras consultas
    await db.query("INSERT INTO questions (question, response) VALUES (?, ?)", [promptContent, gptResponse]);

    // Devuelve la respuesta de OpenAI en formato JSON}

    console.log({ success: true, response: gptResponse })

    return { success: true, response: gptResponse };
  } catch (error) {
    // Manejo de errores de conexión a la base de datos o la API
    console.error("Database or API Error:", error.response ? error.response.data : error.message);
    return { success: false, error: "An error occurred while processing your request." };
  }
}

module.exports = { callGPT };
