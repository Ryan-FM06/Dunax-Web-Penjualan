class HomePagePresenter {
  constructor({ view }) {
    this.view = view
  }

  init() {
    this.view.afterRender()
  }
}

export default HomePagePresenter
