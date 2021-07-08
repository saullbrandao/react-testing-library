import 'whatwg-fetch'
import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {GreetingLoader} from '../greeting-loader-01-mocking'

const server = setupServer(
  rest.post('/greeting', (request, response, context) => {
    return response(
      context.json({
        data: {
          greeting: `Hello ${request.body.subject}`,
        },
      }),
    )
  }),
)

beforeAll(() => server.listen({onUnhandledRequest: 'error'}))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

test('loads greetings on click', async () => {
  render(<GreetingLoader />)
  const nameInput = screen.getByLabelText(/name/i)
  const loadButton = screen.getByText(/load/i)

  userEvent.type(nameInput, 'Mary')
  userEvent.click(loadButton)

  await waitFor(() =>
    expect(screen.getByLabelText(/greeting/i)).toHaveTextContent(`Hello Mary`),
  )
})
