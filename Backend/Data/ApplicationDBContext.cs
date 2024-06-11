using Backend.Models;
using Microsoft.EntityFrameworkCore;
namespace Backend.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
            : base(dbContextOptions)
        {


        }
        public DbSet<Book> Books { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Borrowing> Borrowings { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure constraints, indexes, etc. here
            modelBuilder.Entity<Book>().HasIndex(b => b.ISBN).IsUnique();
            modelBuilder.Entity<Borrowing>().HasOne(b => b.User).WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Borrowing>().HasOne(b => b.Book).WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Review>().HasOne(r => r.User).WithMany().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Review>().HasOne(r => r.Book).WithMany().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
    
