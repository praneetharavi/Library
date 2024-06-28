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
            public DbSet<Review> Reviews { get; set; }

            public DbSet<UserBooks> UserBooks { get; set; }


            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
          
                base.OnModelCreating(modelBuilder); // Ensure Identity models are configured




            List<IdentityRole> roleList = new List<IdentityRole> {
                   new IdentityRole
                   {
                       Name = Models.Roles.Librarian,
                       NormalizedName = Models.Roles.Librarian.ToUpper()
                   },
                   new IdentityRole
                   {
                       Name = Models.Roles.Customer,
                       NormalizedName = Models.Roles.Customer.ToUpper()
                    }

                };

            modelBuilder.Entity<IdentityRole>().HasData(roleList);

            // Configure constraints, indexes, etc. here
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
                    .HasOne(r => r.User)
                    .WithMany()
                    .OnDelete(DeleteBehavior.Cascade);
                modelBuilder.Entity<Review>()
                    .HasOne(r => r.Book)
                    .WithMany()
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure IdentityUserLogin primary key
                modelBuilder.Entity<IdentityUserLogin<string>>().HasKey(x => new { x.LoginProvider, x.ProviderKey });
            }
        }
    }