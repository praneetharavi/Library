namespace Backend.Dtos.Book
{
    public class AddToCartRequest
    {
        public string UserId { get; set; }
        public int BookId { get; set; }
    }
}
