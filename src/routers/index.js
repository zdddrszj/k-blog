

const rootRouter = {
  path: '/list', 
  component: require('../containers/home'),
  childRoutes: [
    {
      path: '/list/:categoryId:tagId', 
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('../containers/home'))
        })
      },
    },
    {
      path: '/admin/write', 
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('../containers/admin/write'))
        })
      },
    }
  ]
}

export default rootRouter