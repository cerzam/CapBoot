import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `Eres un experto en marketing digital especializado en ciclismo profesional.
Tu tarea es generar captions para Instagram y Facebook sobre contenido de ciclismo.

Contexto del nicho:
- Ciclismo profesional: carreras (Tour de France, Giro, Vuelta, Classics), equipos, ciclistas destacados
- Datos y estadísticas: tiempos, distancias, desniveles, potencias, records
- Cultura ciclista: sufrimiento, camaradería, el café, los cols, la bicicleta como estilo de vida
- Equipo y tecnología: bicicletas, componentes, aerodinámica, nutrición

Reglas para el caption:
1. Idioma: siempre en español
2. El tono lo define el usuario en cada solicitud — respétalo al pie de la letra
3. Estructura: texto principal natural y fluido + salto de línea + 10 hashtags relevantes
4. El texto debe sonar auténtico, como lo escribiría un aficionado apasionado, no un robot
5. Los hashtags deben mezclar: hashtags grandes (#ciclismo, #cycling) con hashtags de nicho (#rodadamatutina, #vidaciclista)
6. NO uses comillas alrededor del caption
7. NO incluyas introducción ni explicación, responde SOLO con el caption listo para copiar y pegar`

export async function generateCaption(imageBase64, mimeType, tone) {
  const response = await client.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${imageBase64}` },
          },
          {
            type: 'text',
            text: `Analiza esta imagen de ciclismo y genera un caption con tono: ${tone}.`,
          },
        ],
      },
    ],
  })

  return response.choices[0].message.content.trim()
}
