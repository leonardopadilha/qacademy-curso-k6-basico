import http from 'k6/http';
import { sleep, check } from 'k6'

export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisicoes deve responder em até 2s
    http_req_failed: ['rate<0.01'] // 1% das requisicoes podem ocorrer erro
  }
}

export default function () {
  const num = new Date().getTime()
  const numero = num * (Math.random() * 50)

  const url = 'http://localhost:3333/signup'

  const payload = JSON.stringify(
    { email: `peter${numero}@qa.empresa.com.br`, password: "pwd123" }
  )

  const headers = {
    'headers': { 'Content-Type': 'application/json' }
  }

  const res = http.post(url, payload, headers);

  //console.log("Num:::" + num)
  //console.log("Body:::" + res.body)

  check(res, { 
    'status should be 201': (r) => r.status === 201
  })
  sleep(1)
}