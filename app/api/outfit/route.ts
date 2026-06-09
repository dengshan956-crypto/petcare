import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { clothing, occasion, season } = await req.json();

  if (!clothing) {
    return NextResponse.json({ error: "请输入服装信息" }, { status: 400 });
  }

  const stream = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    stream: true,
    system: `你是一位专业的时尚穿搭顾问，专门为身高168cm、体重120斤的女生提供穿搭建议。
该用户体型匀称，身材比例较好，腿部修长。
请根据用户提供的服装单品，给出具体、实用的搭配建议，包括：
1. 推荐的搭配单品（上衣/下装/外套/鞋子/配饰）
2. 颜色搭配方案
3. 适合的场合
4. 针对她身材的穿搭小技巧
用中文回复，语气亲切时尚，分条列举清晰易读。`,
    messages: [
      {
        role: "user",
        content: `我有一件${clothing}${occasion ? `，想穿去${occasion}` : ""}${season ? `，现在是${season}` : ""}，请帮我推荐搭配方案。`
      }
    ]
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    }
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked"
    }
  });
}
