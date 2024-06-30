    using Backend.Models;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
namespace Backend.Data
{
    public class ApplicationDBContext : IdentityDbContext<User>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
            : base(dbContextOptions)
        {


        }
        public DbSet<Book> Books { get; set; }
        public DbSet<Borrowing> Borrowings { get; set; }

        public DbSet<UserBooks> UserBooks { get; set; }


        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

           base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Book>().HasIndex(b => b.ISBN).IsUnique();
            modelBuilder.Entity<Borrowing>()
                .HasOne(b => b.User)
                .WithMany()
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Borrowing>()
                .HasOne(b => b.Book)
                .WithMany()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
          .HasOne(b => b.User)
          .WithMany()
          .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Review>()
                .HasOne(b => b.Book)
                .WithMany()
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<IdentityUserLogin<string>>().HasKey(x => new { x.LoginProvider, x.ProviderKey });

        }
    }

}