package com.voyago.server.repositories;

import com.voyago.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // כאן נוכל להוסיף בעתיד שיטות חיפוש מיוחדות, כמו מציאת משתמש לפי אימייל
    User findByEmail(String email);
}