package com.voyago.server.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.voyago.server.utils.JwtUtil;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = null;
        
        // 1. חיפוש העוגייה בשם "jwt" מתוך כל העוגיות בבקשה
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // 2. אם מצאנו טוקן, נוודא שהוא תקין ונחלץ ממנו את שם המשתמש
        if (token != null) {
            try {
                // שים לב: אם ב-JwtUtil שמרת email, המתודה הזו צריכה להחזיר email. 
                // אם עברת לשמור username בתוך הטוקן ב-Login, זה יחזיר username.
                String username = jwtUtil.extractUsername(token); 

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // מגדירים את המשתמש כמזוהה במערכת (נותנים לו "פס" כניסה)
                    UsernamePasswordAuthenticationToken authToken = 
                            new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                // הטוקן לא תקין או פג תוקף - נתעלם והמשתמש יישאר לא מזוהה
                System.out.println("Invalid JWT Token: " + e.getMessage());
            }
        }

        // 3. המשך השרשרת (אם המשתמש מזוהה הוא יעבור, אם לא הוא ייחסם בהמשך)
        filterChain.doFilter(request, response);
    }
}