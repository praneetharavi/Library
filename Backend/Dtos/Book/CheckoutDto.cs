namespace Backend.Dtos.Book
{
    public class CheckoutDto
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int BookId { get; set; }
        public string BookName { get; set; }
        public string Author { get; set; }
        public DateTime BorrowDate { get; set; }

        public DateTime ReturnDate { get; set; }


    }
}
