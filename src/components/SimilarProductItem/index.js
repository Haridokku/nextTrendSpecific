import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {imageUrl, title, price, brand, rating} = details
  return (
    <li className="list-item">
      <img src={imageUrl} alt={`similar product ${title}`} className="img" />
      <p className="title">{title}</p>
      <p className="brand">{brand}</p>
      <div className="price-container">
        <p className="price">Rs {price}/- </p>
        <div className="blue">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
