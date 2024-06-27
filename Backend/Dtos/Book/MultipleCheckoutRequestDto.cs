namespace Backend.Dtos.Book
{
    public class MultipleCheckoutRequestDto
    {
        public string UserId { get; set; }
        public List<int> BookIds { get; set; }
    }

}
