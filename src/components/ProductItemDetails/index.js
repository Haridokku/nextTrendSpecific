import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    similarItemList: [],
    activeItem: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getDetailedProduct()
  }

  getDetailedProduct = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        title: fetchedData.title,
        price: fetchedData.price,
        description: fetchedData.description,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        similarProducts: fetchedData.similar_products,
      }
      const similarProductsList = updatedData.similarProducts.map(item => ({
        id: item.id,
        imageUrl: item.image_url,
        title: item.title,
        style: item.style,
        price: item.price,
        description: item.description,
        brand: item.brand,
        totalReviews: item.total_reviews,
        rating: item.rating,
        availability: item.availability,
      }))

      console.log(updatedData)
      console.log(similarProductsList)
      this.setState({
        similarItemList: similarProductsList,
        activeItem: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onIncreaseCount = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecreaseCount = () => {
    this.setState(prevState => ({quantity: prevState.quantity - 1}))
  }

  renderProductItemDetails = () => {
    const {activeItem, similarItemList} = this.state
    return (
      <div className="detail-container">
        <img src={activeItem.imageUrl} alt="product" className="image" />
        <h1 className="head">{activeItem.title}</h1>
        <p className="describe">Rs {activeItem.price}</p>
        <div className="horizontal">
          <div className="blue">
            <p className="describe">{activeItem.rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
          <p className="describe1">{activeItem.totalReviews}</p>
        </div>
        <p className="describe1">{activeItem.description}</p>
        <p className="describe1">
          <span className="available">Available</span>
          {activeItem.availability}
        </p>
        <p className="describe1">
          <span className="available">Brand</span>
          {activeItem.brand}
        </p>
        <hr className="horizontal-line" />
        <div className="zoom-container">
          <BsDashSquare
            data-testid="minus"
            className="size"
            onClick={this.onDecreaseCount()}
          />
          <p className="describe">1</p>
          <BsPlusSquare
            data-testid="plus"
            className="size"
            onClick={this.onIncreaseCount()}
          />
        </div>
        <button type="button" className="rating">
          ADD TO CART
        </button>
        <h1 className="head">Similar Products</h1>
        <ul className="similar-products-container">
          {similarItemList.map(each => (
            <SimilarProductItem details={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  returnToProducts = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error"
      />
      <h1 className="head">Product Not Found</h1>
      <button
        type="button"
        className="rating"
        onClick={this.returnToProducts()}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="productItemDetails-container">
        <Header />
        {this.renderAllProducts()}
      </div>
    )
  }
}

export default ProductItemDetails
