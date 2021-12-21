import { users } from '../user.js'

describe('user resolvers', () => {
  describe('users()', () => {
    it('throws an error for non-admins', () => {
      expect(
        users(
          null,
          { id: '3311cfe8-9764-434d-b80e-1b1ee72c686d' },
          { userInfo: {} },
        ),
      ).rejects.toEqual(new Error('You must be a site admin to retrieve users'))
    })
  })
})
