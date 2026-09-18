async function testFake() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-goog-api-key": "fake_key_123"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "hi" }] }]
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

testFake();
