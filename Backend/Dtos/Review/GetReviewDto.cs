namespace Backend.Dtos.Review
{
    public class GetReviewDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public int BookId { get; set; }
        public int Rating { get; set; }
        public string ReviewText { get; set; }
    }

}
